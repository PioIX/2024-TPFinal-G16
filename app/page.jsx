'use client';

import React, { useEffect } from 'react';

import Hero from '../components/Hero';
import Content from '../components/Content';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Index() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    async function fetchRegisterUser() {
        const url = `http://localhost:5001/register`;
        if (!user) return;
        console.log(user)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        // Maneja errores si la respuesta no es válida
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status} - ${errorText}`);
            return;
        }


        try {
            const res = await response.json();
            console.log(res);
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    }

    fetchRegisterUser();
}, [user]);

  return (
    <>
      
      <Hero />
      <hr />
      <Content />
    </>
  );
}
