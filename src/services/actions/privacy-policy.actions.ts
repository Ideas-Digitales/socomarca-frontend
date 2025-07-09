'use server';

export async function savePrivacyPolicy(content: string) {
  try {
    if (!content || !content.trim()) {
      return { success: false, error: 'Content is required' };
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

    return { success: true, message: 'Privacy policy updated successfully' };
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getPrivacyPolicy() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/privacy-policy`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        content: data.content || 'Comienza a escribir tu contenido aquí...' 
      };
    } else {
      throw new Error('Failed to fetch privacy policy');
    }
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return { 
      success: false, 
      error: 'Internal server error',
      content: 'Comienza a escribir tu contenido aquí...'
    };
  }
} 