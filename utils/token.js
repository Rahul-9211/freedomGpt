export const generateAccessToken = async function(userDetails){
  const token = await jwt.sign(userDetails, 'secret', { expiresIn: '1h' });
  return token;
}


export const generateRefreshToken = async function(userDetails){
  const token = await jwt.sign(userDetails, 'secret', { expiresIn: '10d' });
  return token;
}