import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-white text-black">
            <header>
                <div className="container p-3  flex items-center justify-between">
                    <img src="/images/logo.png" className="w-32 h-21"></img>
                    <nav>
                        <ul className="flex items-center gap-4 text-black">
                            <li className="hover:font-bold hover:underline">
                                <a href="/home"> Home</a>
                            </li>
                            <li className="hover:font-bold hover:underline">
                                <a href="/tracker"> tracker</a>
                            </li>
                            <li className="font-bold">
                                <a href="#"> Eco-Insights</a>
                            </li>
                            <li className="hover:font-bold hover:underline">
                                <a href="/profile"> Profile</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="border-none bg-amber-200 drop-shadow-lg rounded-lg px-4 py-6 m-2 flex flex-col items-center w-3/4 max-w-lg">
                    <div>air quality:</div>
                    <div>UV index:</div>
                    <div>Temperature:</div>
                    <div>humidity:</div>
                </div>
            </header >
            <main>
                <section
                    id="hero"
                    className=" relative bg-cover h-screen flex justify-center items-center text-center">
                </section>
            </main>
        </div >
    );
}
