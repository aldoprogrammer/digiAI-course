import { Helmet } from 'react-helmet';

import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils/cn';

import Footer from './Footer/Footer';
import MobileNavbar from './Navbar/MobileNavbar';
import Navbar from './Navbar/Navbar';
import { LayoutProps } from './types';

const Layout = ({ children, className, title, fullWidth }: LayoutProps) => {
  const { isTablet } = useWindowSize();

  let pageTitle: string = 'NekoTip';
  if (title) {
    pageTitle = title + ' - NekoTip';
  }
  return (
    <>
      <Helmet title={pageTitle}></Helmet>
      <div className="h-full w-full">
        <div
          className={cn(
            'relative mx-auto grid min-h-screen',
            // "auto" is for the main tag
            // add "max-content" to the "grid-rows" class below for each div if want to add more "static" elements
            'grid-rows-[max-content_auto_max-content]',
          )}
        >
          {isTablet ? <MobileNavbar /> : <Navbar />}
          <div className="mb-10 mt-6 flex w-full justify-center lg:mb-14 lg:mt-10">
            <main
              className={cn(
                'w-full px-4',
                !fullWidth && 'max-w-[1280px]',
                className,
              )}
            >
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
