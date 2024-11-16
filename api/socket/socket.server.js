import { Server } from "socket.io";

let io;

const connectedUsers = new Map();
// { userId: socketId }
/*	Sebuah Map untuk menyimpan hubungan antara userId dan socketId. 
	Ini memungkinkan server untuk melacak socket yang terhubung dengan pengguna tertentu, 
	yang berguna untuk fitur seperti mengirim pesan kepada pengguna tertentu.
*/

export const initializeSocket = (httpServer) => {
	io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL,
			credentials: true,
		},
	});

	/**----------------------------------------------------------------
	 * menambahkan middleware untuk memvalidasi setiap koneksi yang datang.
	 */
	io.use((socket, next) => {
		const userId = socket.handshake.auth.userId;
		/**
		 * socket.handshake.auth.userId digunakan untuk mengambil userId yang dikirimkan oleh client saat mencoba terhubung. 
		 * Jika userId tidak ada atau tidak valid, koneksi akan ditolak dengan error "Invalid user ID".
		 */
		if (!userId) return next(new Error("Invalid user ID"));
		
		socket.userId = userId;
		/**
		 * Jika valid, userId disimpan di objek socket sebagai properti (socket.userId), 
		 * sehingga nanti bisa digunakan saat event lainnya (misalnya untuk melacak pengguna yang terhubung).
		*/
		next();
	});

	/**------------------------------------------------------------------------------
	 * Ini adalah event yang tertrigger setiap kali ada pengguna yang berhasil terhubung ke server WebSocket. 
	 * Saat koneksi berhasil, event ini akan dipanggil dan memberikan socket sebagai argumen.
	 */
	io.on("connection", (socket) => {
		console.log(`User connected with socket id: ${socket.id}`);
		connectedUsers.set(socket.userId, socket.id);
		/**
		 * connectedUsers.set(socket.userId, socket.id): menambahkan pasangan userId dan socket.id ke dalam Map connectedUsers, sehingga server bisa 
		 * mengetahui ID socket yang digunakan oleh pengguna dengan userId tertentu.
		 */

		socket.on("disconnect", () => {
			console.log(`User disconnected with socket id: ${socket.id}`);
			connectedUsers.delete(socket.userId);
		});
		/**
		 * socket.on("disconnect", ...): Event ini dipanggil ketika pengguna terputus dari WebSocket. 
		 * Saat terputus, server menghapus data userId yang terhubung dengan socketId di connectedUsers.
		 */
	});
};

/**---------------------------------------------------------------------
 * getIO digunakan untuk mengakses instance io yang sudah diinisialisasi. 
 * Jika io belum diinisialisasi (misalnya, fungsi initializeSocket belum dipanggil), 
 * maka fungsi ini akan melempar error dengan pesan "Socket.io not initialized!".
 */

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};

/**
 * 
 * Fungsi ini mengembalikan connectedUsers, yang merupakan Map yang menyimpan hubungan antara userId dan socketId. 
 * Ini bisa digunakan untuk memeriksa siapa saja yang terhubung dan mencari tahu ID socket dari pengguna tertentu.
 */
export const getConnectedUsers = () => connectedUsers;