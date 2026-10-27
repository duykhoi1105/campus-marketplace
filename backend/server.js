/**
 * Campus Marketplace - Backend REST API Server
 * Tự động chạy với Node.js thuần (Zero-dependency, không cần cài thêm package).
 * Chạy bằng lệnh: node backend/server.js hoặc npm run server
 * Cổng mặc định: 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Dữ liệu mẫu khởi tạo chuẩn đề tài Chợ Sinh Viên - Đại học Công nghệ Đồng Nai
const INITIAL_DATA = {
  users: [
    {
      id: 'USR-01',
      name: 'Nguyễn Duy Khôi',
      email: '1923050528@dntu.edu.vn',
      role: 'BUYER',
      phone: '0901234567',
      campusLocation: 'Ký túc xá Khu B, DNTU',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: '2026-10-14T08:00:00.000Z',
    },
    {
      id: 'USR-02',
      name: 'Duy Khôi (Sinh Viên Bán Hàng)',
      email: 'duykhoi.seller@dntu.edu.vn',
      role: 'SELLER',
      phone: '0912345678',
      campusLocation: 'Giảng đường A3, DNTU',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2026-10-14T08:30:00.000Z',
    },
    {
      id: 'USR-03',
      name: 'CLB Học Thuật CNTT DNTU',
      email: 'clb.cntt@dntu.edu.vn',
      role: 'SELLER',
      phone: '0987654321',
      campusLocation: 'Văn phòng Đoàn Khoa CNTT',
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      createdAt: '2026-10-15T09:00:00.000Z',
    },
  ],
  listings: [
    {
      id: 'LIST-01',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
      sellerPhone: '0912345678',
      title: 'Giáo trình Cấu trúc dữ liệu & Giải thuật DNTU',
      description: 'Sách photo bìa bóng kính, có sẵn note bài tập chương 3 và 4 thi giữa kỳ, tình trạng còn rất mới.',
      category: 'textbooks',
      price: 45000,
      stock: 4,
      photoUri: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600',
      createdAt: '2026-10-20T08:00:00.000Z',
      updatedAt: '2026-10-20T08:00:00.000Z',
      isAvailable: true,
      condition: 'like-new',
    },
    {
      id: 'LIST-02',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
      sellerPhone: '0912345678',
      title: 'Máy tính cầm tay Casio fx-580VN X',
      description: 'Máy chính hãng Bitex còn tem bảo hành 1 năm, pin tốt, phục vụ thi toán cao cấp và xác suất thống kê.',
      category: 'electronics',
      price: 320000,
      stock: 2,
      photoUri: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600',
      createdAt: '2026-10-21T09:30:00.000Z',
      updatedAt: '2026-10-21T09:30:00.000Z',
      isAvailable: true,
      condition: 'used',
    },
    {
      id: 'LIST-03',
      sellerId: 'USR-03',
      sellerName: 'CLB Học Thuật CNTT DNTU',
      sellerPhone: '0987654321',
      title: 'Chuột không dây Logitech M331 Silent Đen',
      description: 'Chuột click êm không ồn trong thư viện và phòng học, dùng 1 pin AA dùng 12 tháng, kết nối USB receiver.',
      category: 'electronics',
      price: 180000,
      stock: 5,
      photoUri: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600',
      createdAt: '2026-10-22T10:15:00.000Z',
      updatedAt: '2026-10-22T10:15:00.000Z',
      isAvailable: true,
      condition: 'like-new',
    },
    {
      id: 'LIST-04',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
      sellerPhone: '0912345678',
      title: 'Tài liệu Lập trình ứng dụng di động React Native',
      description: 'Tổng hợp bài tập thực hành Lab 01 đến Lab 08, kèm các ví dụ Expo Router, State Management, và AsyncStorage.',
      category: 'textbooks',
      price: 50000,
      stock: 3,
      photoUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      createdAt: '2026-10-23T11:00:00.000Z',
      updatedAt: '2026-10-23T11:00:00.000Z',
      isAvailable: true,
      condition: 'new',
    },
    {
      id: 'LIST-05',
      sellerId: 'USR-03',
      sellerName: 'CLB Học Thuật CNTT DNTU',
      sellerPhone: '0987654321',
      title: 'Áo đồng phục thể dục DNTU size L (Nam)',
      description: 'Áo chính quy trường Đại học Công nghệ Đồng Nai, vải thun mè thoáng mát, mới mặc 2 lần kỳ quân sự.',
      category: 'uniforms',
      price: 70000,
      stock: 2,
      photoUri: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600',
      createdAt: '2026-10-24T14:20:00.000Z',
      updatedAt: '2026-10-24T14:20:00.000Z',
      isAvailable: true,
      condition: 'like-new',
    },
    {
      id: 'LIST-06',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
      sellerPhone: '0912345678',
      title: 'Bình đun siêu tốc Sunhouse 1.8L ký túc xá',
      description: 'Inox 304 an toàn, công suất 1500W sôi nhanh trong 4 phút, tự ngắt khi sôi, còn hoạt động hoàn hảo.',
      category: 'living',
      price: 110000,
      stock: 1,
      photoUri: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600',
      createdAt: '2026-10-25T08:45:00.000Z',
      updatedAt: '2026-10-25T08:45:00.000Z',
      isAvailable: true,
      condition: 'used',
    },
    {
      id: 'LIST-07',
      sellerId: 'USR-03',
      sellerName: 'CLB Học Thuật CNTT DNTU',
      sellerPhone: '0987654321',
      title: 'Combo 5 cuốn vở kẻ ngang Campus 200 trang',
      description: 'Giấy chống lóa, định lượng 70gsm, còn nguyên bọc màng co chưa bóc.',
      category: 'stationery',
      price: 55000,
      stock: 10,
      photoUri: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
      createdAt: '2026-10-25T15:10:00.000Z',
      updatedAt: '2026-10-25T15:10:00.000Z',
      isAvailable: true,
      condition: 'new',
    },
    {
      id: 'LIST-08',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
      sellerPhone: '0912345678',
      title: 'Bàn học gấp gọn sinh viên chân sắt chữ U',
      description: 'Mặt gỗ MDF phủ melamine chống trầy, có khe để iPad và khay cắm cốc nước tiện lợi.',
      category: 'living',
      price: 85000,
      stock: 3,
      photoUri: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
      createdAt: '2026-10-26T09:00:00.000Z',
      updatedAt: '2026-10-26T09:00:00.000Z',
      isAvailable: true,
      condition: 'used',
    },
    {
      id: 'LIST-09',
      sellerId: 'USR-03',
      sellerName: 'CLB Học Thuật CNTT DNTU',
      sellerPhone: '0987654321',
      title: 'Tai nghe chụp tai Sony WH-CH520 Wireless',
      description: 'Pin 50 tiếng, kết nối Bluetooth 5.2 đa điểm, âm thanh rõ nét, micro đàm thoại học online tốt.',
      category: 'electronics',
      price: 650000,
      stock: 1,
      photoUri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      createdAt: '2026-10-26T16:30:00.000Z',
      updatedAt: '2026-10-26T16:30:00.000Z',
      isAvailable: true,
      condition: 'like-new',
    },
    {
      id: 'LIST-10',
      sellerId: 'USR-02',
      sellerName: 'Duy Khôi (Sinh Viên Bán Hàng)',
      sellerPhone: '0912345678',
      title: 'Thẻ nhớ SanDisk Ultra microSD 64GB Class 10',
      description: 'Tốc độ đọc lên tới 100MB/s, kèm khay adapter SD, dùng cho điện thoại, máy ảnh hoặc Raspberry Pi.',
      category: 'electronics',
      price: 95000,
      stock: 6,
      photoUri: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80532e?w=600',
      createdAt: '2026-10-27T10:00:00.000Z',
      updatedAt: '2026-10-27T10:00:00.000Z',
      isAvailable: true,
      condition: 'new',
    },
    {
      id: 'LIST-11',
      sellerId: 'USR-03',
      sellerName: 'CLB Học Thuật CNTT DNTU',
      sellerPhone: '0987654321',
      title: 'Áo sơ mi trắng đồng phục DNTU size M',
      description: 'Áo đồng phục lễ phục trường DNTU có thêu logo trước ngực. Mặt hàng hiện đã hết tồn kho để kiểm thử trạng thái hết hàng.',
      category: 'uniforms',
      price: 90000,
      stock: 0,
      photoUri: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
      createdAt: '2026-10-27T11:00:00.000Z',
      updatedAt: '2026-10-27T11:00:00.000Z',
      isAvailable: false,
      condition: 'used',
    },
  ],
  orders: [],
};

// Đọc dữ liệu từ file hoặc khởi tạo
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DATA;
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let db = loadData();

// Hàm phản hồi JSON có CORS
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

// Hàm đọc body JSON
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Dữ liệu JSON không hợp lệ'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Bật CORS cho Preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = reqUrl.pathname || '/';

  // 1. Phục vụ ảnh tĩnh đã tải lên
  if (pathname.startsWith('/uploads/')) {
    const filename = path.basename(pathname);
    const filePath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filename).toLowerCase();
      const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      res.writeHead(200, {
        'Content-Type': mime,
        'Access-Control-Allow-Origin': '*',
      });
      return fs.createReadStream(filePath).pipe(res);
    }
    return sendJson(res, 404, { message: 'Ảnh không tồn tại' });
  }

  try {
    // 2. Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'ok',
        appName: 'Campus Marketplace Backend',
        timestamp: new Date().toISOString(),
        totalListings: db.listings.length,
      });
    }

    // 3. Đăng nhập / Auth
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const user = db.users.find(u => u.email.toLowerCase() === email || u.id === body.id);

      if (!user) {
        // Cho phép đăng nhập demo dễ dàng
        const defaultUser = db.users[0];
        return sendJson(res, 200, {
          token: `jwt-token-${defaultUser.id}-${Date.now()}`,
          user: defaultUser,
        });
      }

      return sendJson(res, 200, {
        token: `jwt-token-${user.id}-${Date.now()}`,
        user,
      });
    }

    // 4. Danh sách tin đăng
    if (pathname === '/api/listings' && req.method === 'GET') {
      const category = reqUrl.searchParams.get('category');
      const search = (reqUrl.searchParams.get('search') || '').toLowerCase();

      let result = [...db.listings];

      if (category && category !== 'all') {
        result = result.filter(item => item.category === category);
      }

      if (search) {
        result = result.filter(item =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)
        );
      }

      return sendJson(res, 200, result);
    }

    // 5. Chi tiết 1 tin đăng: GET /api/listings/:id
    const listingMatch = pathname.match(/^\/api\/listings\/([^/]+)$/);
    if (listingMatch) {
      const id = listingMatch[1];

      if (req.method === 'GET') {
        const item = db.listings.find(l => l.id === id);
        if (!item) {
          return sendJson(res, 404, { message: 'Không tìm thấy tin đăng.' });
        }
        return sendJson(res, 200, item);
      }

      // Sửa tin đăng: PUT /api/listings/:id
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const index = db.listings.findIndex(l => l.id === id);
        if (index === -1) {
          return sendJson(res, 404, { message: 'Không tìm thấy tin đăng để cập nhật.' });
        }

        const existing = db.listings[index];
        // Kiểm tra quyền: Người sửa phải là người bán chính chủ
        if (body.sellerId && body.sellerId !== existing.sellerId) {
          return sendJson(res, 403, { message: 'Bạn không có quyền sửa tin đăng của người khác.' });
        }

        // Cập nhật
        const updated = {
          ...existing,
          title: body.title !== undefined ? String(body.title).trim() : existing.title,
          description: body.description !== undefined ? String(body.description).trim() : existing.description,
          price: body.price !== undefined ? Math.max(0, Number(body.price)) : existing.price,
          stock: body.stock !== undefined ? Math.max(0, parseInt(body.stock, 10)) : existing.stock,
          category: body.category || existing.category,
          photoUri: body.photoUri || existing.photoUri,
          isAvailable: body.stock !== undefined ? parseInt(body.stock, 10) > 0 : existing.isAvailable,
          updatedAt: new Date().toISOString(),
        };

        db.listings[index] = updated;
        saveData(db);
        return sendJson(res, 200, updated);
      }

      // Xóa tin đăng: DELETE /api/listings/:id
      if (req.method === 'DELETE') {
        const index = db.listings.findIndex(l => l.id === id);
        if (index === -1) {
          return sendJson(res, 404, { message: 'Tin đăng không tồn tại.' });
        }

        const sellerId = req.headers['x-user-id'] || reqUrl.searchParams.get('sellerId');
        if (sellerId && sellerId !== db.listings[index].sellerId) {
          return sendJson(res, 403, { message: 'Bạn không có quyền xóa tin này.' });
        }

        const deleted = db.listings.splice(index, 1)[0];
        saveData(db);
        return sendJson(res, 200, { message: 'Đã xóa tin đăng thành công.', deletedId: deleted.id });
      }
    }

    // 6. Tạo tin đăng mới: POST /api/listings
    if (pathname === '/api/listings' && req.method === 'POST') {
      const body = await parseBody(req);

      // Validate bắt buộc
      if (!body.title || !body.title.trim()) {
        return sendJson(res, 400, { message: 'Tiêu đề tin đăng không được để trống.' });
      }
      if (!body.photoUri || !body.photoUri.trim()) {
        return sendJson(res, 400, { message: 'Bắt buộc phải có ít nhất một ảnh hợp lệ.' });
      }
      const price = Number(body.price);
      if (isNaN(price) || price < 0) {
        return sendJson(res, 400, { message: 'Giá bán phải là số hợp lệ không âm.' });
      }
      const stock = parseInt(body.stock, 10);
      if (isNaN(stock) || stock < 0) {
        return sendJson(res, 400, { message: 'Số lượng tồn kho phải là số nguyên không âm.' });
      }

      const newListing = {
        id: `LIST-${Date.now().toString().slice(-6)}`,
        sellerId: body.sellerId || 'USR-02',
        sellerName: body.sellerName || 'Duy Khôi (Sinh Viên)',
        sellerPhone: body.sellerPhone || '0912345678',
        title: body.title.trim(),
        description: (body.description || '').trim(),
        category: body.category || 'other',
        price,
        stock,
        photoUri: body.photoUri,
        originalPhotoSize: body.originalPhotoSize || null,
        compressedPhotoSize: body.compressedPhotoSize || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAvailable: stock > 0,
        condition: body.condition || 'used',
      };

      db.listings.unshift(newListing);
      saveData(db);
      return sendJson(res, 201, newListing);
    }

    // 7. Upload ảnh (Base64 dataURI): POST /api/upload
    if (pathname === '/api/upload' && req.method === 'POST') {
      const body = await parseBody(req);
      const dataUri = body.dataUri || body.image;

      if (!dataUri) {
        return sendJson(res, 400, { message: 'Không nhận được dữ liệu ảnh (dataUri).' });
      }

      // Xử lý base64 dataURI
      const matches = dataUri.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let buffer;
      let extension = 'jpg';

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime === 'image/png') extension = 'png';
        if (mime === 'image/webp') extension = 'webp';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(dataUri, 'base64');
      }

      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
      const savePath = path.join(UPLOAD_DIR, filename);
      fs.writeFileSync(savePath, buffer);

      const serverHost = req.headers.host || `localhost:${PORT}`;
      const protocol = 'http';
      const fileUrl = `${protocol}://${serverHost}/uploads/${filename}`;

      return sendJson(res, 200, {
        url: fileUrl,
        filename,
        sizeBytes: buffer.length,
        message: 'Upload ảnh thành công',
      });
    }

    // 8. Đặt hàng / Tạo đơn hàng: POST /api/orders
    if (pathname === '/api/orders' && req.method === 'POST') {
      const body = await parseBody(req);
      const items = body.items || [];

      if (!items.length) {
        return sendJson(res, 400, { message: 'Giỏ hàng không có mặt hàng nào.' });
      }

      // Kiểm tra tồn kho từng mặt hàng
      for (const item of items) {
        const listing = db.listings.find(l => l.id === item.listingId);
        if (!listing) {
          return sendJson(res, 400, { message: `Mặt hàng "${item.title || item.listingId}" không còn tồn tại.` });
        }
        if (listing.stock < item.quantity) {
          return sendJson(res, 400, {
            message: `Mặt hàng "${listing.title}" chỉ còn ${listing.stock} sản phẩm (yêu cầu: ${item.quantity}).`,
          });
        }
      }

      // Trừ tồn kho thực tế
      for (const item of items) {
        const listing = db.listings.find(l => l.id === item.listingId);
        if (listing) {
          listing.stock -= item.quantity;
          listing.isAvailable = listing.stock > 0;
        }
      }

      const order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        buyerId: body.buyerId || 'USR-01',
        buyerName: body.buyerName || 'Nguyễn Duy Khôi',
        items,
        subtotal: body.subtotal,
        shippingMethod: body.shippingMethod || 'CAMPUS_PICKUP',
        shippingFee: body.shippingFee || 0,
        total: body.total,
        pickupLocation: body.pickupLocation || 'Cổng chính DNTU',
        note: body.note || '',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      db.orders.unshift(order);
      saveData(db);

      return sendJson(res, 201, {
        message: 'Xác nhận đơn hàng thành công!',
        order,
      });
    }

    // Không khớp endpoint nào
    return sendJson(res, 404, { message: 'Endpoint không tồn tại.' });

  } catch (error) {
    console.error('Server error:', error);
    return sendJson(res, 500, { message: 'Lỗi máy chủ nội bộ: ' + error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`[CAMPUS MARKETPLACE BACKEND] Đang chạy tại:`);
  console.log(`- Localhost: http://localhost:${PORT}`);
  console.log(`- API URL:   http://localhost:${PORT}/api/listings`);
  console.log(`- Upload:    http://localhost:${PORT}/api/upload`);
  console.log(`- Health:    http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
