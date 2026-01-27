"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Tipe data Job
interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  _count?: { applications: number };
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Tambah Job
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: "",
  });

  // 1. Cek Login & Ambil Data
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/"); // Tendang ke login kalau gak ada token
      return;
    }
    fetchJobs();
  }, [router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:3000/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Gagal ambil job:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi Logout
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  // 3. Fungsi Buat Job Baru
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const res = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Kirim token biar dikenali backend
        },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error("Gagal membuat job");

      // Sukses
      setIsModalOpen(false); // Tutup modal
      setNewJob({ title: "", description: "", requirements: "" }); // Reset form
      fetchJobs(); // Refresh daftar job
      alert("Lowongan berhasil dibuat!");
    } catch (error) {
      alert("Error saat membuat job. Pastikan sudah login.");
    }
  };

  if (loading)
    return <div className="p-10 text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* NAVBAR */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Recruiter Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-300 font-semibold cursor-pointer"
        >
          Logout
        </button>
      </nav>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Daftar Lowongan</h2>
            <p className="text-gray-400 text-sm mt-1">
              Kelola lowongan pekerjaan aktif Anda.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <span>+</span> Buat Lowongan Baru
          </button>
        </div>

        {/* Job Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
            <p className="text-gray-400">Belum ada lowongan.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:shadow-blue-900/20 hover:border-blue-500/50 transition duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                    {job.title}
                  </h3>
                  <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full border border-green-800">
                    Active
                  </span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4 h-16">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-500">
                    <span className="text-white font-bold">
                      {job._count?.applications || 0}
                    </span>{" "}
                    Pelamar
                  </div>
                  <button className="text-sm text-blue-400 hover:underline cursor-pointer">
                    Lihat Detail →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL FORM CREATE JOB */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Tambah Lowongan Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Posisi / Judul Pekerjaan
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  placeholder="Contoh: Senior Backend Engineer"
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-24"
                  placeholder="Jelaskan tanggung jawab utama..."
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Kualifikasi (Requirements)
                </label>
                <textarea
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-24"
                  placeholder="Contoh: - Menguasai NestJS&#10;- Minimal 2 tahun pengalaman"
                  value={newJob.requirements}
                  onChange={(e) =>
                    setNewJob({ ...newJob, requirements: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition shadow-lg shadow-blue-900/20"
                >
                  Simpan & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
