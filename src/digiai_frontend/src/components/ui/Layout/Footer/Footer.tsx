import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'About Us', to: '#' },
        { name: 'Explore Courses', to: '/courses' },
        { name: 'Trending Courses', to: '/dashboard/discover' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', to: '#' },
        { name: 'Privacy Policy', to: '#' },
        { name: 'Cookie Policy', to: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Twitter', to: '#' },
        { name: 'Facebook', to: '#' },
        { name: 'Instagram', to: '#' },
        { name: 'Telegram', to: '#' },
      ],
    },
  ];

  return (
    <footer className="w-full border-t bg-mainAccent  py-12 text-white font-medium text-black">
      <section className="container mx-auto flex flex-col gap-8 px-4 md:gap-14 xl:flex-row xl:justify-between xl:gap-20">
        <div className="flex flex-row items-center gap-4 w-full">
          <img
            src="https://media.discordapp.net/attachments/1314806383195197475/1319296521648472115/Blue_and_Yellow_Modern_Innovating_Online_Learning_Logo-3.png?ex=67661ae2&is=6764c962&hm=b61d401349e5a7c30bb048d47deeec8aebed84779a4341510902f1a2e4e696f8&=&format=webp&quality=lossless&width=733&height=733"
            alt="DigiAI Course logo"
            className="mb-4 w-32 sm:w-40 xl:w-44"
          />
          <p className="text-lg sm:text-xl text-black font-medium leading-relaxed">
            Transforming education with cutting-edge AI-driven courses designed for the future.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {footerLinks.map((footer) => (
            <div key={footer.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-title">{footer.title}</h3>
              <ul className="space-y-2">
                {footer.links.map((item) => (
                  <li key={item.name} className="text-sm text-black">
                    <Link to={item.to} className="hover:text-title transition duration-200 ease-in-out">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 border-t pt-8 text-center text-sm text-black">
        <p>&copy; 2024 DigiAI Course. All rights reserved.</p>
      </section>
    </footer>
  );
};

export default Footer;
