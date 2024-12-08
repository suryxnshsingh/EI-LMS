import React from "react";
import { LinkPreview } from "./linkpreview";
export default function Footer(){
    return(
        <div>
            <section id ="contact">
            <footer className="bg-neutral-900">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0 w-28 flex items-center">
                        <img
                            src="/GS LOGO.png" alt="logo"></img>
                        <div className="ml-4">
                            <div className="text-2xl text-white text-nowrap">
                                EI Department LMS
                                </div>
                                <div className="text-xl text-white font-thin md:text-nowrap">
                                    Shri G. S. Institute of Tech. and Science
                                </div>
                                <div className="text-xl text-white font-thin text-nowrap ">
                                    Park Road, Indore
                                </div>
                            </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold  uppercase text-white">About</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="/" className="hover:underline">Copyright</a>
                                </li>
                                <li>
                                    <a href="/" className="hover:underline">Privacy Policy</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase text-white">Contact Us</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="#" className="hover:underline">+91 987654321</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:underline">ei.dept@sgsits.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6  sm:mx-auto border-gray-700 lg:my-8" />
                <div className="flex justify-center items-center max-md:flex-col flex-row ">
                        <div className="text-sm text-white sm:text-center max-md:pb-2">
                            Crafted by :
                        </div>
                        <div className="flex justify-center flex-row items-center">
                        <LinkPreview 
                            url="https://www.linkedin.com/in/suryxnshsingh/"
                            target="_blank"
                            imageSrc="suryansh.jpg"
                            isStatic
                            className="ml-4 text-sm text-gray-400 sm:text-center"
                            >
                            Suryansh Singh
                        </LinkPreview>
                        <LinkPreview 
                            url="https://www.linkedin.com/in/pranshuaf/"
                            target="_blank"
                            imageSrc="pranshu.jpg"
                            isStatic
                            className="ml-4 text-sm text-gray-400 sm:text-center"
                            >
                            Pranshu Pandey
                        </LinkPreview>
                        
                        </div>
                    </div>
                </div>
            </footer>
            </section>
        </div>
    )
}