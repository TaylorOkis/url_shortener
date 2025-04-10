const getIpInfo = async (ip: string) => {
  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("failed to get IP address information");
  }
};

export default getIpInfo;
