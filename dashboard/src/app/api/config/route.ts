// app/api/config/route.ts
import { NextResponse } from 'next/server';
import { getGatewayPublicBaseUrl, getPublicSignupUrl } from './config.server';


export async function GET() {

    // retrieve the nestJS gateway backend url
    try {
        const gatewayPublicBaseUrl = getGatewayPublicBaseUrl();
        const publicSignupUrl = getPublicSignupUrl();

        return NextResponse.json({
            gatewayPublicBaseUrl: gatewayPublicBaseUrl,
            publicSignupUrl: publicSignupUrl,
            websocketBaseUrl : gatewayPublicBaseUrl.replace(/\/api\/?$/, '')
        })
        
    }catch (error) {
        const message = error instanceof Error ? error.message : 'Config error';
        return NextResponse.json(    
        { error: message },
        { status: 500 }
        );
    }

}