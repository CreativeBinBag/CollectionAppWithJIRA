import React from 'react'
import { Box } from '@mui/material'
import Appbar from '../components/Appbar'
import RecentItem from '../components/RecentItems/RecentItem'
import TopCollections from '../components/TopCollections/TopCollections'
import TagCloud from '../components/TagDisplay/TagCloud'
const HomePage = () => {
  return (
    <Box>
     <Appbar/>
     <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <TopCollections />
        <RecentItem />
        <TagCloud />
      </Box>
    </Box>
  )
}

export default HomePage
