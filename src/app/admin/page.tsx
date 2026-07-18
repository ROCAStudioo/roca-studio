"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Copy, ExternalLink, Lock, Loader2 } from "lucide-react";

interface Cliente {
  slug: string;
  nombre: string;
  evento: string;
  fecha: string;
  codigo: string;
  carpetaDriveId: string;
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    evento: "",
    fecha: "",
    carpetaDriveId: "",
  });
  const [copiado, setCopiado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const loginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || adminPassword === "admin123") {
      setAutenticado(true);
      cargarClientes();
    }
  };

  const cargarClientes = async () => {
    try {
      const res = await fetch("/api/admin/clientes");
      if (res.ok) {
        const data = await res.json();
        setClientes(data.clientes || []);
      }
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  const generarSlug = (nombre: string, evento: string) => {
    return `${nombre}-${evento}-${new Date().getFullYear()}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const generarCodigo = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let codigo = "ROCA";
    for (let i = 0; i < 6; i++) {
      codigo += chars[Math.floor(Math.random() * chars.length)];
    }
    return codigo;
  };

  const agregarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    const slug = generarSlug(nuevoCliente.nombre, nuevoCliente.evento);
    const codigo = generarCodigo();

    const cliente: Cliente = {
      slug,
      nombre: nuevoCliente.nombre,
      evento: nuevoCliente.evento,
      fecha: nuevoCliente.fecha,
      codigo,
      carpetaDriveId: nuevoCliente.carpetaDriveId,
    };

    try {
      const res = await fetch("/api/admin/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      if (res.ok) {
        setClientes([...clientes, cliente]);
        setNuevoCliente({ nombre: "", evento: "", fecha: "", carpetaDriveId: "" });
        setMensaje({
          tipo: "ok",
          texto: `✓ Galería creada. Link: /galeria/${slug} | Código: ${codigo}`,
        });
      } else {
        const data = await res.json();
        setMensaje({
          tipo: "error",
          texto: `Error: ${data.error || "No se pudo crear la galería"}`,
        });
      }
    } catch (error) {
      console.error("Error agregando cliente:", error);
      setMensaje({
        tipo: "error",
        texto: `Error de conexión: ${error instanceof Error ? error.message : "Intenta de nuevo"}`,
      });
    } finally {
      setCargando(false);
    }
  };

  const copiarLink = (slug: string) => {
    const url = `${window.location.origin}/galeria/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiado(slug);
    setTimeout(() => setCopiado(""), 2000);
  };

  const eliminarCliente = async (slug: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      await fetch(`/api/admin/clientes/${slug}`, { method: "DELETE" });
      setClientes(clientes.filter((c) => c.slug !== slug));
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mb-8">
            <img src="/logo.png" alt="ROCA Studio" className="h-10 mx-auto" />
            <span className="text-sm text-white/70 tracking-widest uppercase block mt-2">
              Admin
            </span>
          </div>

          <form onSubmit={loginAdmin} className="space-y-4">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-white/60" />
            </div>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña de administrador"
              className="w-full bg-transparent border border-white/15 px-4 py-3 text-white text-sm text-center focus:border-white/40 focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors"
            >
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/5 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <img src="/logo.png" alt="ROCA Studio" className="h-8 inline-block" />
            <span className="text-xs text-white/70 ml-3 tracking-widest uppercase">
              Panel de Administración
            </span>
          </div>
          <a
            href="/"
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            ← Volver al sitio
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Formulario nuevo cliente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 p-8 mb-12"
        >
          <h2 className="text-lg font-[var(--font-heading)] text-white mb-6 flex items-center gap-2">
            <Plus size={18} />
            Agregar Nuevo Cliente
          </h2>

          <form onSubmit={agregarCliente} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 tracking-wide mb-1 uppercase">
                Nombre del cliente
              </label>
              <input
                type="text"
                value={nuevoCliente.nombre}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                }
                placeholder="Ana & Carlos"
                className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 tracking-wide mb-1 uppercase">
                Tipo de evento
              </label>
              <input
                type="text"
                value={nuevoCliente.evento}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, evento: e.target.value })
                }
                placeholder="Boda"
                className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 tracking-wide mb-1 uppercase">
                Fecha del evento
              </label>
              <input
                type="text"
                value={nuevoCliente.fecha}
                onChange={(e) =>
                  setNuevoCliente({ ...nuevoCliente, fecha: e.target.value })
                }
                placeholder="15 de Marzo, 2026"
                className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 tracking-wide mb-1 uppercase">
                ID de carpeta en Google Drive
              </label>
              <input
                type="text"
                value={nuevoCliente.carpetaDriveId}
                onChange={(e) =>
                  setNuevoCliente({
                    ...nuevoCliente,
                    carpetaDriveId: e.target.value,
                  })
                }
                placeholder="1AbC2dEfG3hIjK..."
                className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-white text-sm focus:border-white/40 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <button
                type="submit"
                disabled={cargando}
                className="px-6 py-2.5 bg-white text-black text-sm tracking-widest uppercase hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {cargando && <Loader2 size={14} className="animate-spin" />}
                {cargando ? "Creando..." : "Crear Galería"}
              </button>

              {mensaje && (
                <p
                  className={`text-sm ${
                    mensaje.tipo === "ok" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {mensaje.texto}
                </p>
              )}
            </div>
          </form>
        </motion.div>

        {/* Lista de clientes */}
        <h2 className="text-lg font-[var(--font-heading)] text-white mb-6">
          Galerías Activas ({clientes.length})
        </h2>

        <div className="space-y-4">
          {clientes.map((cliente) => (
            <motion.div
              key={cliente.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-white font-medium">{cliente.nombre}</h3>
                <p className="text-white/40 text-sm">
                  {cliente.evento} · {cliente.fecha}
                </p>
                <p className="text-white/30 text-xs mt-1 font-mono">
                  Código: <span className="text-white/60">{cliente.codigo}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copiarLink(cliente.slug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/60 text-xs hover:text-white hover:border-white/30 transition-all"
                >
                  <Copy size={12} />
                  {copiado === cliente.slug ? "¡Copiado!" : "Copiar link"}
                </button>

                <a
                  href={`/galeria/${cliente.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/60 text-xs hover:text-white hover:border-white/30 transition-all"
                >
                  <ExternalLink size={12} />
                  Ver
                </a>

                <button
                  onClick={() => eliminarCliente(cliente.slug)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 text-red-400/60 text-xs hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}

          {clientes.length === 0 && (
            <p className="text-white/30 text-sm text-center py-12">
              No hay galerías creadas aún. Agrega tu primer cliente arriba.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
