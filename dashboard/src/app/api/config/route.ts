// app/api/config/route.ts
import { NextResponse } from 'next/server';
import { getGatewayBaseUrl, getPublicSignupUrl } from './config.server';


export async function GET() {

    // retrieve the nestJS gateway backend url
    try {
        const gatewayBaseUrl = getGatewayBaseUrl();
        const publicSignupUrl = getPublicSignupUrl();

        return NextResponse.json({
            gatewayBaseUrl: gatewayBaseUrl,
            publicSignupUrl: publicSignupUrl
        })
        
    }catch (error) {
        const message = error instanceof Error ? error.message : 'Config error';
        return NextResponse.json(    
        { error: message },
        { status: 500 }
        );
    }

}