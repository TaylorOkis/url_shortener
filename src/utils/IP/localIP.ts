const isLocalIPAddress = (ip: string): boolean => {
  return (
    ip === "::1" ||
    ip.startsWith("127.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  );
};

export default isLocalIPAddress;
