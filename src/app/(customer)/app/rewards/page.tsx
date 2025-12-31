"use client";

import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button,
  Card,
} from "konsta/react";
import {
  TicketIcon,
  GiftIcon,
  HistoryIcon,
  ChevronRightIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBranch } from "@/context/BranchContext";

export default function CustomerRewardsPage() {
  const { user } = useAuth();
  const { currentBranch } = useBranch();

  // Mock rewards data
  const userPoints = 1250;
  const availableVouchers = [
    {
      id: 1,
      title: "Diskon 20% Nasi Goreng",
      code: "NG20",
      exp: "31 Des 2025",
    },
    {
      id: 2,
      title: "Gratis Es Teh Manis",
      code: "FREEDRINK",
      exp: "15 Jan 2026",
    },
  ];

  return (
    <Page>
      <Navbar title="Hadiah & Poin" subtitle={currentBranch?.name} />

      <Block className="!mt-4">
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-primary/30 flex flex-col items-center">
          <div className="size-16 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
            <GiftIcon className="size-8" />
          </div>
          <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">
            Total Poin Anda
          </p>
          <h2 className="text-5xl font-black mt-2">
            {userPoints.toLocaleString()}
          </h2>
          <p className="text-xs mt-4 bg-black/10 px-4 py-1.5 rounded-full border border-white/10 uppercase font-medium">
            Makin banyak pesanan, makin untung!
          </p>
        </div>
      </Block>

      <BlockTitle>🎟️ Voucher Saya</BlockTitle>
      <List strongIos outlineIos className="!mx-4">
        {availableVouchers.map((voucher) => (
          <ListItem
            key={voucher.id}
            link
            title={voucher.title}
            subtitle={`Exp: ${voucher.exp}`}
            after={
              <span className="font-mono font-bold text-primary">
                {voucher.code}
              </span>
            }
            media={<TicketIcon className="size-5 text-orange-500" />}
          />
        ))}
        {availableVouchers.length === 0 && (
          <div className="p-8 text-center text-muted">
            Belum ada voucher tersedia
          </div>
        )}
      </List>

      <BlockTitle>📜 Riwayat Transaksi</BlockTitle>
      <List strongIos outlineIos className="!mx-4 mb-8">
        <ListItem
          link
          title="Pesanan #1204"
          subtitle="Toko Pusat (A) - 30 Des 2025"
          after={<span className="text-success font-medium">+150 Pts</span>}
          media={<HistoryIcon className="size-5 text-blue-500" />}
        />
        <ListItem
          link
          title="Pesanan #1189"
          subtitle="Toko Pusat (A) - 25 Des 2025"
          after={<span className="text-success font-medium">+200 Pts</span>}
          media={<HistoryIcon className="size-5 text-blue-500" />}
        />
        <Button large clear className="!mt-4">
          Lihat Semua Riwayat
        </Button>
      </List>

      <Block className="text-center text-xs text-slate-400 pb-8">
        Suku & Ketentuan Berlaku. Poin dapat ditukarkan dengan menu spesial di
        outlet kami.
      </Block>
    </Page>
  );
}
