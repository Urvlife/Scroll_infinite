'use client'




import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getCuratedPhotos } from './utils/api'
import router, { useRouter } from 'next/router';

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type Image = {
  id: number
  href: string
  src: {
    landscape: string
  }
  name: string
  username: string
  url: String,
  photographer: string
}

export default function Gallery({ images }: { images: Image[] }) {

  const [curatedPhotos, setCuratedPhotos] = useState<Image[]>([]);
  const [allPhotos, setAllPhotos] = useState<Image[]>([]);
  const [page, setPage] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('')


  const fetchCuratedPhotos = async (page: any) => {
    try {
      const photos = await getCuratedPhotos(page);
      setCuratedPhotos((prevPhotos) => [...prevPhotos, ...photos]);
      setAllPhotos((prevPhotos) => [...prevPhotos, ...photos])

    } catch (error) {
      console.error('Error fetching curated photos:', error);
    }
  };

  useEffect(() => {
    fetchCuratedPhotos(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 300; // Adjust this value as needed
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - scrollThreshold;

      if (isBottom) {
        // Trigger the fetch for more data
        let newPage = page;
        fetchCuratedPhotos(newPage + 1);
        setPage((prevPage) => prevPage + 1);
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFilter = (e: any) => {
    console.log(e.target.value)
    let tempPhotos = [...curatedPhotos]
    setKeyword(e.target.value)

    let temp = tempPhotos.filter((curr) => curr.photographer.toLocaleLowerCase().includes(e.target.value))
    console.log(temp)
    setCuratedPhotos(prev => prev = temp)
  }

  const handleReset = () => {
    setKeyword('')
    setCuratedPhotos(prev => prev = allPhotos)
  }

//Blur effect
const handleImageLoad = () => {
  setLoading(false);
};

const navigateToImageDetails = (image: Image) => {
  // Navigate to the image details page
  router.push(`/image/${image.id}`);
};





  return (
    <div className="mainContainer">
      <div className='filterContainer'>
        <input type='text' value={keyword} onChange={handleFilter} />
        <button onClick={handleReset}>reset</button>
      </div>
      {curatedPhotos?.length ?
        <div className="imageContainer">
          {curatedPhotos?.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div> : <h3 style={{ textAlign: 'center' }}>No Data Present</h3>}
    </div>
  )
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);
  console.log(image)

  return (
    <div className='imageItems'>
      <Image
        alt=""
        src={image?.src?.landscape}
        // layout="fill"
        objectFit="cover"
        width={180}
        height={150}
        className='img'
        onLoadingComplete={() => setLoading(false)}
        loading='lazy'
      />
      <span className="imageHeading">{image.photographer}</span>
      {/* <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p> */}
    </div>
  )
}



function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}










