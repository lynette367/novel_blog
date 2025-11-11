const { searchNovels } = require('../utils/novelReader');

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
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
      return;
    }
    
    const results = searchNovels(q);
    
    res.status(200).json({
      success: true,
      query: q,
      count: results.length,
      results: results.map(novel => ({
        slug: novel.slug,
        title: novel.title,
        description: novel.description,
        coverImage: novel.coverImage,
        totalChapters: novel.totalChapters
      }))
    });
  } catch (error) {
    console.error('Error searching novels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search novels',
      message: error.message
    });
  }
};
