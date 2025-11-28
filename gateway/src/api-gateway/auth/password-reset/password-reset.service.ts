import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '../../../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

type MailPayload = {
  to: string;
  subject: string;
  text: string;
};

type UpstreamError = {
  upstreamStatus: number;
  upstreamBody: unknown;
};

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  private apiBase: string;
  private gwSecret: string;

  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {
    const protocol = this.config.get<string>('OCEANOPS_PROTOCOL', 'https');
    const host = this.config.get<string>('OCEANOPS_HOST', 'localhost:8080');
    // mirror proxy.routes.ts → targetPath: '/api/data'
    const targetPath = '/api/data';
    this.apiBase = `${protocol}://${host}${targetPath}`;
    this.gwSecret = this.config.get<string>('GATEWAY_SHARED_SECRET', '');
  }

  async request(email: string): Promise<unknown> {
    const clean = (email ?? '').trim().toLowerCase();
    const res = await fetch(`${this.apiBase}/password/reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Gateway-Secret': this.gwSecret,
      },
      body: JSON.stringify({ email: clean }),
    });

    const raw = await res.text();
    this.logger.log(`OceanOPS password reset request -> ${email}`);

    const body = tryParse(raw);

    if (!res.ok) {
      const errorResult: UpstreamError = {
        upstreamStatus: res.status,
        upstreamBody: body,
      };
      return errorResult;
    }

    // 202 with a mailPayload → send mail via Gateway
    if (res.status === 202 && hasMailPayload(body)) {
      const { to, subject, text } = body.mailPayload;

      const html = text
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
        .replace(/\n/g, '<br/>');

      await this.mailer.sendMail(to, subject, html, 'AMRIT');
      return { queued: true };
    }

    // Fallback: return parsed upstream body or a default
    if (body == null) {
      return { queued: false, mailPayload: null };
    }

    return body;
  }

  async confirm(token: string, newPassword: string): Promise<unknown> {
    const res = await fetch(`${this.apiBase}/password/reset/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Gateway-Secret': this.gwSecret,
      },
      body: JSON.stringify({ token: (token ?? '').trim(), newPassword }),
    });

    const raw = await res.text();
    const body = tryParse(raw);

    this.logger.debug(`OceanOPS /confirm -> ${res.status} ${raw}`);

    if (!res.ok) {
      const errorResult: UpstreamError = {
        upstreamStatus: res.status,
        upstreamBody: body,
      };
      return errorResult;
    }

    return { ok: true };
  }
}

/**
 * Safe JSON parser → never returns `any`, always `unknown`
 */
function tryParse(t: string): unknown {
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return { raw: t };
  }
}

type MailPayloadResponse = {
  mailPayload: MailPayload;
};

/**
 * Type guard: does this body contain a well-formed mailPayload?
 */
function hasMailPayload(body: unknown): body is MailPayloadResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  if (!('mailPayload' in body)) {
    return false;
  }

  const mailPayload = (body as { mailPayload: unknown }).mailPayload;

  if (typeof mailPayload !== 'object' || mailPayload === null) {
    return false;
  }

  const m = mailPayload as {
    to?: unknown;
    subject?: unknown;
    text?: unknown;
  };

  return (
    typeof m.to === 'string' &&
    typeof m.subject === 'string' &&
    typeof m.text === 'string'
  );
}
