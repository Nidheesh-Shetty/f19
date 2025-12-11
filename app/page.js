import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header>
        <div className="container p-3  flex items-center justify-between">
          <img src="/images/logo.png" className="w-32 h-21"></img>



          <nav>
            <ul className="flex items-center gap-4">  
              <li className="hover:font-bold">
                <a href="/login"> Login</a>
              </li>
              <li className="hover:font-bold">
                <a href="/register"> Register!</a>
              </li>
              
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className=" relative bg-cover min-h-[384px] text-white flex justify-center items-center text-center"
        >

          <div className="absolute inset-0 z-0 bg-gray-800/45"></div>

          <div className="container relative z-10">
            <h1 className="text-7xl font-black uppercase ">Title goes here</h1>
            <h2>Lorem ipsum</h2>
            <a href="#" className="button"> Call to action </a>
          </div>
        </section>
      </main>
    </>
  );
}
