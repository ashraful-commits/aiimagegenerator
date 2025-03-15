'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImage(null);
    setImageLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setImage(`data:image/webp;base64,${data.imageUrl}`);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'generated-image.webp';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Head>
        <title>AI Image Generator - Create Stunning Images with AI</title>
        <meta
          name="description"
          content="Generate stunning images using AI. Enter a prompt and let our AI create a unique image for you. Download and share your creations!"
        />
        <meta
          name="keywords"
          content="AI image generator, AI art, generate images, AI tools, image creation"
        />
        <meta property="og:title" content="AI Image Generator - Create Stunning Images with AI" />
        <meta
          property="og:description"
          content="Generate stunning images using AI. Enter a prompt and let our AI create a unique image for you."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta property="og:image" content="https://yourwebsite.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Image Generator - Create Stunning Images with AI" />
        <meta
          name="twitter:description"
          content="Generate stunning images using AI. Enter a prompt and let our AI create a unique image for you."
        />
        <meta name="twitter:image" content="https://yourwebsite.com/og-image.jpg" />
        <link rel="canonical" href="https://yourwebsite.com" />
      </Head>

      <main style={styles.container}>
        <header>
          <h1 style={styles.title}>AI Image Generator</h1>
          <p style={styles.subtitle}>Create stunning images with AI</p>
        </header>

        <section>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              required
              style={styles.input}
              disabled={loading}
              aria-label="Enter a prompt to generate an image"
            />
            <button
              type="submit"
              disabled={loading}
              style={styles.button}
              aria-label="Generate Image"
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {error && <p style={styles.error}>{error}</p>}

          {imageLoading && (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Generating image...</p>
            </div>
          )}

          {image && (
            <div style={styles.imageContainer}>
              <img
                src={image}
                alt={`AI-generated image based on: ${prompt}`}
                style={styles.image}
                onLoad={() => setImageLoading(false)}
              />
              <button
                onClick={handleDownload}
                style={styles.downloadButton}
                aria-label="Download Image"
              >
                Download Image
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: '12px',
    width: '300px',
    marginRight: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#ff4d4f',
    marginTop: '10px',
    fontSize: '1rem',
  },
  loadingContainer: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderLeftColor: '#0070f3',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  imageContainer: {
    marginTop: '30px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  },
  downloadButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
};

// Add CSS for spinner animation
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);