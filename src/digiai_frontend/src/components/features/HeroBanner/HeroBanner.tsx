import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import useWindowSize from '@/hooks/useWindowSize';
import { useAuthManager } from '@/store/AuthProvider';

const HeroBanner = () => {
  const { login } = useAuthManager();
  const { isMobile } = useWindowSize();

  return (
    <div className="flex w-full justify-center bg-thirdAccent">
      <section className="relative w-full max-w-[1280px] px-4 pb-8 sm:pb-12 md:pb-36 md:pt-10">
        <p className="mb-4 text-center font-montserrat text-sm font-medium text-subtext md:mb-5 md:text-xl">
          An online course where you can obtain certificates on ICP environment
        </p>
        <div className="flex flex-col items-center text-center text-4xl font-semibold xs:text-5xl md:text-7xl">
          <div className="flex items-center gap-3 md:gap-5">
            <h1>Enhancing</h1>
            <h1>your</h1>
          </div>
          <h1>skills, leverage lesson with AI, and securee your certificates</h1>
        </div>
        <img
              src="https://media.discordapp.net/attachments/1314806383195197475/1319296521648472115/Blue_and_Yellow_Modern_Innovating_Online_Learning_Logo-3.png?ex=67661ae2&is=6764c962&hm=b61d401349e5a7c30bb048d47deeec8aebed84779a4341510902f1a2e4e696f8&=&format=webp&quality=lossless&width=733&height=733"
              alt="nekotip"
              className="w-[60px] sm:w-[75px] md:w-[110px] mx-auto"
            />

        <div className="mt-5 flex items-center justify-center gap-6 md:mt-9 md:gap-10">
          <Button
            size={isMobile ? 'small' : 'default'}
            className="md:w-[250px]"
            onClick={login}
          >
            Register
          </Button>

          <Link to="/courses">
            <Button
              size={isMobile ? 'small' : 'default'}
              variant={'secondary'}
              className="md:w-[250px]"
            >
              Find A Course
            </Button>
          </Link>
        </div>

        {/* FLOATING ICONS */}
        {/* <img
          src="/images/star-left.svg"
          alt="star"
          className="absolute left-12 top-6 hidden w-20 justify-center md:flex lg:left-24 lg:top-10"
        />
        <img
          src="/images/hexagon-left.svg"
          alt="star"
          className="absolute bottom-10 left-24 hidden w-20 justify-center md:flex lg:bottom-10 lg:left-48"
        />
        <img
          src="/images/hexagon-right.svg"
          alt="star"
          className="absolute right-12 top-6 hidden w-20 justify-center md:flex lg:right-28 lg:top-10"
        />
        <img
          src="/images/star-right.svg"
          alt="star"
          className="absolute bottom-10 right-24 hidden w-20 justify-center md:flex lg:bottom-10 lg:right-48"
        /> */}
      </section>
    </div>
  );
};

export default HeroBanner;
