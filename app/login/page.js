import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-200 to-red-200">
            <div className="border-none bg-white drop-shadow-lg rounded-lg px-4 py-6 m-2 flex flex-col items-center w-3/4 max-w-lg">
                <h1 className="text-green-900 text-4xl font-bold mb-3">Login</h1>
                <a href="/"> <div className="w-12 h-12 bg-slate-700 rounded-full absolute top-30 -left-40">
                    <div className="absolute top-3 left-2">back</div>
                </div>
                </a>
                <form action="#" className="flex flex-col w-1/2">
                    <label htmlFor="name" className="text-black">name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="border border-gray-300 rounded p-1 text-sm w-full mb-4  text-black"
                        placeholder="Name"
                    />

                    <label htmlFor="present" className="text-black">password</label>
                    <input
                        type="text"
                        name="present"
                        id="present"
                        className="border border-gray-300 rounded p-1 text-sm w-full mb-4 text-black"
                        placeholder="password"
                    />



                    <button
                        type="button"
                        className="bg-green-500 text-white rounded-lg hover:bg-green-600 w-full px-2 py-1 mt-5 focus:outline-none focus:ring focus:border-blue-500"
                    >
                        Submit to database
                    </button>
                </form>
            </div>
        </div>
    );
}
