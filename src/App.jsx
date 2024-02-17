import axios from "axios"
import { useRef, useState } from "react"
import { Image } from "cloudinary-react"
import { RiScreenshot2Fill } from "react-icons/ri";
import { MdContentPaste } from "react-icons/md";
import { ClockLoader, SyncLoader } from "react-spinners";
import Intro from "./components/Intro"
function App() {
  const urlRef = useRef()
  const [image, setImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [protocol, setProtocol] = useState("https://")
  const getSS = async () => {
    const query = "https://api.screenshotone.com/take?format=jpeg&image_quality=5&full_page=true"
    const url = encodeURIComponent(`${protocol}${urlRef.current.value}`)
    setIsLoading(true)
    setImageLoaded(false)
    setStatusMessage("")
    setError(null)
    try {
      setStatusMessage("Getting Screenshot")
      const res1 = await axios.get(`${query}&url=${url}&access_key=${import.meta.env.VITE_SCREENSHOTONE_ACCESS_KEY}`, { responseType: 'arraybuffer' })
      const base64Img = btoa(
        new Uint8Array(res1.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      setStatusMessage("Uploading to Cloudinary")
      const res2 = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        file: `data:image/jpeg;base64,${base64Img}`,
        upload_preset: `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`
      })
      setImage(res2.data)
    } catch (err) {
      setError(err)
    }
    setIsLoading(false)
    setStatusMessage("")
  }
  return (
    <>
      <div
        className="flex flex-col items-center"
      >
        <div
          className="border-2 rounded-lg p-2 w-96 flex items-center justify-between m-5 focus-within:border-black sticky top-2 bg-white"
        >
          <select 
            className="w-18 shadow-sm focus-within:outline-none sm:text-sm"
            value={protocol} 
            onChange={(e)=>{setProtocol(e.target.value)}}
          >
            <option value="https://">https</option>
            <option value="png">http</option>
          </select>
          <input
            className=" w-60 focus-within:outline-none"
            type="url"
            placeholder="example.com"
            ref={urlRef}
          />
          <button
            onClick={async () => {
              const res = await navigator.clipboard.readText()
              urlRef.current.value = res
            }}
          >
            <MdContentPaste />
          </button>
          {!isLoading &&
            <button
              className="text-2xl"
              onClick={() => getSS()}
            >
              <RiScreenshot2Fill />
            </button>
          }
        </div>
        <div>
          <div className="flex flex-col items-center">
            {image == "" && !isLoading && error== null && <Intro />}
            <ClockLoader
              color={"#000000"}
              loading={isLoading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            {statusMessage != "" &&
              <div>{statusMessage}</div>
            }
          </div>
          {error && <div>{error.message}</div>}
          {image != "" && isLoading == false && error == null &&
            <div
              className="flex flex-col p-5 border-2 w-fit m-5 shadow-lg rounded-lg bg-gray-100 font-serif"
            >
              <SyncLoader loading={!imageLoaded} />
              {imageLoaded &&
                <div
                  className="flex flex-col border-b-2 m-3"
                >
                  <span>Created at: {image.created_at}</span>
                  <span>Size: {Math.round(image.bytes / 1024, 3)} Kb</span>
                </div>
              }
              <div>
                <Image className={"shadow-lg rounded-lg"} cloudName="duznb5jsl" publicId={image.public_id} onLoad={() => setImageLoaded(true)} />
              </div>

            </div>
          }
        </div>
      </div>
    </>
  )
}

export default App
