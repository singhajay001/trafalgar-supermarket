// Trafalgar Supermarket & Cellars - Full Website Code

// 1. Setting up Next.js (React Framework) with Tailwind CSS
import { useEffect, useState } from 'react';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

// Define Themes
const themes = {
  light: {
    background: 'bg-white',
    text: 'text-black',
    header: 'bg-blue-600 text-white',
    footer: 'bg-gray-800 text-white',
    button: 'bg-blue-500 text-white hover:bg-blue-600',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    header: 'bg-gray-800 text-gray-100',
    footer: 'bg-gray-700 text-gray-100',
    button: 'bg-gray-700 text-white hover:bg-gray-800',
  },
  fresh: {
    background: 'bg-green-100',
    text: 'text-green-900',
    header: 'bg-green-500 text-white',
    footer: 'bg-green-700 text-white',
    button: 'bg-green-500 text-white hover:bg-green-600',
  },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;
  }

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text}`}>
      <Head>
        <title>Trafalgar Supermarket & Cellars</title>
        <meta name="description" content="Your Local Store, Better Prices Every Day!" />
        <meta name="keywords" content="grocery, supermarket, liquor, discounts, online shopping" />
        <meta name="author" content="Trafalgar Supermarket & Cellars" />
        <meta property="og:title" content="Trafalgar Supermarket & Cellars" />
        <meta property="og:description" content="Your Local Store, Better Prices Every Day!" />
        <meta property="og:image" content="/path/to/image.jpg" />
        <meta property="og:url" content="https://trafalgarsupermarketandcellars.com.au" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <header className={`${currentTheme.header} p-4 flex justify-between items-center`}>
        <h1 className="text-xl font-bold">Trafalgar Supermarket</h1>
        <input
          type="text"
          placeholder="Search for products..."
          className="p-2 rounded border"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {session ? (
          <button onClick={() => signOut()} className={currentTheme.button}>Sign Out</button>
        ) : (
          <button onClick={() => signIn()} className={currentTheme.button}>Sign In</button>
        )}
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/products" className="hover:underline">Products</Link></li>
          <li><Link href="/cart" className="hover:underline">Cart</Link></li>
          <li><Link href="/checkout" className="hover:underline">Checkout</Link></li>
        </ul>
      </header>

      <main className="container mx-auto p-6">
        <section>
          <h1 className="text-3xl font-bold">Welcome to Trafalgar Supermarket & Cellars</h1>
          <h2 className="text-xl text-gray-700 mt-2">Featured Products</h2>
          <p className="text-gray-600">Explore our best deals and latest offers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link key={product.id} href={`/products/${product.id}`} passHref>
                <div className={`p-4 shadow rounded cursor-pointer ${currentTheme.button}`}>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <Image src={product.image} alt={product.name} width={200} height={200} loading="lazy" className="rounded" />
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-blue-600">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className={`${currentTheme.footer} p-4 text-center mt-6`}>
        <p>&copy; 2025 Trafalgar Supermarket & Cellars. All rights reserved.</p>
      </footer>
    </div>
  );
}
