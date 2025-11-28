// src/alerts/email-formatter.service.ts
import { Injectable } from '@nestjs/common';
import { AlertEvent, Alert, AlertAttributes } from '../types/alert';
import { extractHost, isValidUrl } from 'src/utils/stringUtils';

@Injectable()
export class EmailFormatterService {
  formatAlertEmailContent(alert: AlertEvent): string {
  const data: Alert = alert?.data || {};
  const attrs: AlertAttributes = data.attributes ?? {};
  
  const buttonStyle = `
    display: inline-block;
    color: #006a7c;
    background-color: #d9f1f3;
    text-decoration: none;
    font-weight: 600;
    padding: 12px 20px;
    border-radius: 12px;
    border: 2px solid #007b8a;
    font-size: 14px;
    text-align: center;
    box-sizing: border-box;
    min-width: 180px;
  `;
  
  const inspectLink = (data.id) 
    ? `<a href="${process.env.REFERENCED_DASHBOARD_URL_IN_EMAILS}/alerts/${data.id}" target="_blank" style="${buttonStyle}">📊 Open in Dashboard</a>` 
    : '';
  
  const seeMoreLink = (attrs.url && isValidUrl(attrs.url)) 
    ? `<a href="${attrs.url}" target="_blank" style="${buttonStyle}">🔗 See more on ${extractHost(attrs.url)}</a>` 
    : '';

  const createTableRow = (label: string, value: any) => {
    if (value !== undefined && value !== null && value !== '') {
      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; background-color: #fafafa; font-weight: 600; width: 35%; color: #555;">
            ${label}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e0e0e0; background-color: #ffffff; color: #333;">
            ${value}
          </td>
        </tr>
      `;
    }
    return '';
  };

  const tableStyle = `
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 20px; 
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
  `;

  const sectionHeaderStyle = `
    color: #007b8a; 
    font-size: 16px; 
    margin: 28px 0 12px 0; 
    font-weight: 600; 
    padding-bottom: 8px;
    border-bottom: 2px solid #007b8a;
  `;

  const serviceValue = Array.isArray(data.service) ? data.service.join(', ') : data.service;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @media only screen and (max-width: 600px) {
          .button-container {
            display: block !important;
            text-align: center !important;
          }
          .button-link {
            display: block !important;
            margin: 8px auto !important;
            max-width: 90% !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="font-family: Lexend, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #fdfdfd;">
      
      <!-- Header -->
      <div style="background-color: #007b8a; color: #ffffff; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">🚨 AMRIT Alert Notification</h1>
        <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">${attrs.alert_category || 'Uncategorized'} · ${alert.data.event || 'Alert'}</p>
      </div>

      <!-- Alert Identity & Quick Actions -->
      <div style="background-color: #d9f1f3; padding: 20px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #007b8a;">
        <div style="margin-bottom: 12px;">
          <span style="font-weight: 600; color: #006a7c;">Alert ID:</span> 
          <span style="color: #333; font-family: monospace; word-break: break-all;">${data.id}</span>
        </div>
        ${(inspectLink || seeMoreLink) ? `
          <div class="button-container" style="margin-top: 16px; text-align: center;">
            ${inspectLink ? `<span class="button-link" style="display: inline-block; margin: 0 6px 8px 6px;">${inspectLink}</span>` : ''}
            ${seeMoreLink ? `<span class="button-link" style="display: inline-block; margin: 0 6px 8px 6px;">${seeMoreLink}</span>` : ''}
          </div>
        ` : ''}
      </div>

      <!-- Summary -->
      <h2 style="${sectionHeaderStyle}">Summary</h2>
      <table style="${tableStyle}">
        <tbody>
          ${createTableRow('Resource', data.resource)}
          ${createTableRow('Country', attrs.Country)}
          ${createTableRow('Date/Time', data.lastReceiveTime)}
          ${createTableRow('Event', data.event)}
        </tbody>
      </table>

      <!-- Status / Severity -->
      <h2 style="${sectionHeaderStyle}">Status & Severity</h2>
      <table style="${tableStyle}">
        <tbody>
          ${createTableRow('Severity', data.severity)}
          ${createTableRow('Status', data.status)}
          ${createTableRow('Duplicate Count', data.duplicateCount)}
        </tbody>
      </table>

      <!-- Metadata -->
      <h2 style="${sectionHeaderStyle}">Metadata</h2>
      <table style="${tableStyle}">
        <tbody>
          ${createTableRow('Argo Type', attrs.ArgoType)}
          ${createTableRow('Last Cycle Number', attrs.lastCycleNumberToRaiseAlarm)}
          ${createTableRow('Last Station Date', attrs.LastStationDate)}
          ${createTableRow('Service', serviceValue)}
          ${createTableRow('Origin', data.origin)}
        </tbody>
      </table>

      <!-- Message -->
      <h2 style="${sectionHeaderStyle}">📋 Message</h2>
      <div style="background-color: #f9f9f9; padding: 16px 20px; border-left: 4px solid #007b8a; border-radius: 12px; margin-bottom: 24px;">
        <p style="margin: 0; color: #555; line-height: 1.7;">${data.text}</p>
      </div>

      <!-- Footer -->
      <hr style="margin: 32px 0 24px 0; border: none; border-top: 1px solid #e0e0e0;" />
      <p style="font-size: 12px; color: #999; text-align: center; margin: 0; line-height: 1.5;">
        This is an automated message from the AMRIT Alert System.<br/>
        Please do not reply directly to this email.
      </p>
    </div>
    </body>
    </html>
  `.replace(/undefined/g, '');
  }
}
