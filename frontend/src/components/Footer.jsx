const Footer = () => {
  const FooterDetails = [
    {
      label: 'Features',
      item1: 'Instant Wallet Creation',
      item2: 'INR-to-Crypto Conversion',
    },
    {
      label: 'Staking',
      item1: 'Earn with MV Tokens',
      item2: 'Swap MV Tokens',
    },
    {
      label: 'Support',
      item1: 'Help Center',
      item2: 'Contact Us',
    },
  ];

  return (
    <footer className="p-20 h-72 flex items-center justify-between text-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 m-10 rounded-xl border-app-purple border shadow-lg">
      <h1 className="text-4xl w-3/4 font-bold text-black tracking-wide animate-pulse">
        Your Crypto Gateway
      </h1>
      <div className="flex gap-y-3 justify-between my-auto items-center w-full">
        {FooterDetails.map((footer, index) => (
          <div className="flex flex-col space-y-6" key={index}>
            <h3 className="text-2xl text-black font-medium">{footer.label}</h3>
            <ul className="flex flex-col gap-y-3 text-lg text-white/90">
              <li>{footer.item1}</li>
              <li>{footer.item2}</li>
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
