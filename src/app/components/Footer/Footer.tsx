// components/Footer/Footer.tsx
import { FC } from 'react';
import { Card, Image, Link } from '@nextui-org/react';
import { FaTasks } from 'react-icons/fa';

const Footer: FC = () => {
    return (
        <footer className="bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div className="flex items-center mb-8 md:mb-0 md:mr-8">
                        <FaTasks className="w-6 h-6 mr-2 text-white" />
                        <div>
                            <p className="text-lg font-semibold">TaskJourney</p>
                            <p className="text-sm">Your Tasks, Gamified</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 justify-center">
                        <div>
                            <h4 className="text-lg font-semibold mb-4">About Us</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className='text-primary-brand-400'>Our Story</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>Contact</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>FAQ</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Community</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className='text-primary-brand-400'>Forum</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>Blog</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>Events</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className='text-primary-brand-400'>Documentation</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>Tutorials</Link></li>
                                <li><Link href="#" className='text-primary-brand-400'>Help Center</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <p>&copy; {new Date().getFullYear()} TaskJourney. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
