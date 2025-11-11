const { getAllNovels, getNovelInfo } = require('./utils/novelReader');

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const novels = getAllNovels();
    
    res.status(200).json({
      success: true,
      count: novels.length,
      novels: novels.map(novel => ({
        slug: novel.slug,
        title: novel.title,
        description: novel.description,
        coverImage: novel.coverImage,
        totalChapters: novel.totalChapters
      }))
    });
  } catch (error) {
    console.error('Error fetching novels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch novels',
      message: error.message
    });
  }
};
