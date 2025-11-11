const { getChapterContent } = require('../../../utils/novelReader');

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
    const { slug, number } = req.query;
    
    if (!slug || !number) {
      res.status(400).json({
        success: false,
        error: 'Novel slug and chapter number are required'
      });
      return;
    }
    
    const chapterNumber = parseInt(number);
    if (isNaN(chapterNumber) || chapterNumber < 1) {
      res.status(400).json({
        success: false,
        error: 'Invalid chapter number'
      });
      return;
    }
    
    const chapter = getChapterContent(slug, chapterNumber);
    
    if (!chapter) {
      res.status(404).json({
        success: false,
        error: 'Chapter not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      chapter
    });
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chapter',
      message: error.message
    });
  }
};
