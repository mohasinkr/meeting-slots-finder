import redis from '@/lib/redis';

// Function to get the entire JSON object from Redis
export async function getRedisData(key:string) {
  try {
    // Use JSON.GET to retrieve the stored JSON object
    const data = await redis.call('JSON.GET', key, '$') as string;
    
    // If data is found, parse it to get the JavaScript object
    if (data) {
      const response = JSON.parse(data);
      // console.log(JSON.stringify(response, null, 2));
      return response;
    } else {
      console.log('No data found for key "participants"');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving participants data from Redis:', error);
    return null;
  }
}