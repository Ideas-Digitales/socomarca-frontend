import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Here you would typically save to your database
    // For now, we'll just return a success response
    // You can replace this with your actual database logic
    
    // Example: await prisma.privacyPolicy.upsert({
    //   where: { id: 1 },
    //   update: { content },
    //   create: { content }
    // });

    console.log('Privacy policy content to save:', content);

    return NextResponse.json(
      { message: 'Privacy policy updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Here you would typically fetch from your database
    // For now, we'll return a placeholder
    // You can replace this with your actual database logic
    
    // Example: const privacyPolicy = await prisma.privacyPolicy.findFirst();
    
    return NextResponse.json(
      { content: 'Comienza a escribir tu contenido aquí...' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 