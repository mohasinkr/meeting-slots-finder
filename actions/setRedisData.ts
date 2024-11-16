"use server";

import redis from '@/lib/redis';

// Function to store a JSON object in Redis using the JSON.SET command
export async function setRedisData(key: string, data: any) {
  try {
    const result = await redis.call('JSON.SET', key, '$', JSON.stringify(data));
    console.log(`JSON data successfully stored at key: ${key}`);
    return result; 
  } catch (error) {
    console.error('Error storing JSON data in Redis:', error);
    return null;
  }
}
