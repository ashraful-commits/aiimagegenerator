import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.image) {
        setImage(`data:image/webp;base64,${data.image}`);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Image Generator</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          required
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: loading ? '#ccc' : '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {image && (
        <div style={{ marginTop: '20px' }}>
          <img src={image} alt="Generated" style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  );
}