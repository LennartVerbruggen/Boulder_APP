import Image from 'next/image'
import RouteService from '../services/RouteService'

const myLoader = ({ src, width, quality }) => {
    return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const MyImage = (props) => {
    return (
        <Image
            src="/klimzaal.png"
            alt="Picture of the boulder."
            width={1000}
            height={1000}
        />
    )
}

const ImageLoader = {
    MyImage
}

export default ImageLoader;