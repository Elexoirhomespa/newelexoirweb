import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Very basic security check for demonstration, 
        // ideally use a secret token from process.env.REVALIDATION_SECRET
        if (body.action === 'revalidate') {
            revalidatePath('/', 'layout');
            revalidatePath('/api/spa-data');
            return NextResponse.json({ revalidated: true, now: Date.now() });
        }
        
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
