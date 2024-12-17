"use client"

import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode';
import logo from '../../../images/IEFK25- Logo png (1).avif'



interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

function DownloadPage() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleDownloadPDF = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/get-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);

        const qrData = `https://userdetials.com/detials?name=${encodeURIComponent(
          data.name
        )}&email=${encodeURIComponent(data.email)}&phone=${encodeURIComponent(
          data.phone
        )}`;
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        setQrCode(qrCodeUrl);

        
        setTimeout(() => {
          const element = document.getElementById('pdf-content');
          if (element) {
            const options = {
              margin: 0.5,
              filename: `${data.name}-details.pdf`,
              html2canvas: { scale: 1 },
              jsPDF: { unit: 'cm', format: [14.8, 10.5] as [number, number], orientation: 'portrait' },
            };
            // Pass the element to html2pdf() directly
            html2pdf(element).set(options).save(); // Correct use of html2pdf with element
          } else {
            console.error('Element not found');
          }
        }, 0);
        

        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'User not found');
        setUserDetails(null);
        setQrCode(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('An error occurred while fetching user data');
      setUserDetails(null);
      setQrCode(null);
    }
  };

  return (
    <>
    
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-green-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">Download ID Card</h1>
        <form onSubmit={handleDownloadPDF}>
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
              Enter Registered Mobile Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Download PDF
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        
        {userDetails && (
          <div
            id="pdf-content"
            className="mt-6 p-6 border rounded-lg "
            style={{background: 'linear-gradient(90deg, rgba(198,225,196,1) 16%, rgb(82, 203, 34) 90%,rgb(107, 252, 49) 100% '}}
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 "  style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={logo.src} alt="logo" style={{height:'100px',width:'100px'}} />
            </h2>
            <div className="text-gray-700" style={{color:'black',border:'1px solid black',borderRadius:'5px',display:'flex',flexDirection:'column',justifyContent:'center',backgroundColor:'white',marginBottom:'20px',padding:'5px'}}>
              <p className="mb-2"><strong >Name:</strong> {userDetails.name}</p>
              <p className="mb-2"><strong >Email:</strong> {userDetails.email}</p>
              <p className="mb-2"><strong >Phone:</strong> {userDetails.phone}</p>
            </div>
            {qrCode && (
            <div className="qr-code-container" style={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
              <img src={qrCode} alt="QR Code" />
             
            </div>
          )}

          </div>
        )}
      </div>
      
    </div>
    </>
  );
}

export default DownloadPage;
