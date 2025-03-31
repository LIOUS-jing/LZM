import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class DoubanBookReviewCrawler:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        }
        self.book_url = "https://book.douban.com/subject/6082808/"  # 百年孤独的豆瓣链接
        self.reviews = []

    def get_review_page(self, page):
        """获取指定页码的评论"""
        try:
            url = f"{self.book_url}comments/hot?p={page}"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logging.error(f"获取第{page}页评论失败: {str(e)}")
            return None

    def parse_reviews(self, html):
        """解析评论页面"""
        if not html:
            return []
        
        soup = BeautifulSoup(html, 'html.parser')
        comments = soup.find_all('div', class_='comment')
        page_reviews = []
        
        for comment in comments:
            try:
                review = {
                    'user': comment.find('span', class_='comment-info').find('a').text.strip(),
                    'rating': comment.find('span', class_='user-stars')['title'] if comment.find('span', class_='user-stars') else '无评分',
                    'time': comment.find('span', class_='comment-time').text.strip(),
                    'content': comment.find('span', class_='short').text.strip(),
                    'votes': comment.find('span', class_='vote-count').text.strip()
                }
                page_reviews.append(review)
            except Exception as e:
                logging.warning(f"解析评论失败: {str(e)}")
                continue
        
        return page_reviews

    def crawl_reviews(self, total_reviews=300):
        """爬取指定数量的评论"""
        page = 1
        while len(self.reviews) < total_reviews:
            logging.info(f"正在爬取第{page}页评论...")
            html = self.get_review_page(page)
            if not html:
                break
                
            page_reviews = self.parse_reviews(html)
            if not page_reviews:
                break
                
            self.reviews.extend(page_reviews[:total_reviews-len(self.reviews)])
            
            # 添加随机延迟，避免请求过于频繁
            time.sleep(random.uniform(2, 4))
            page += 1
            
            if len(self.reviews) >= total_reviews:
                break

    def save_to_csv(self, filename='百年孤独_豆瓣评论.csv'):
        """将评论保存为CSV文件"""
        df = pd.DataFrame(self.reviews)
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        logging.info(f"评论已保存到文件: {filename}")

def main():
    crawler = DoubanBookReviewCrawler()
    crawler.crawl_reviews(300)
    crawler.save_to_csv()

if __name__ == "__main__":
    main() 