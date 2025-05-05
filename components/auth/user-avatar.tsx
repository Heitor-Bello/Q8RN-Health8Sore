"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

interface UserAvatarProps {
  userId: string
  className?: string
}

export function UserAvatar({ userId, className }: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState("U")
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, username")
        .eq("id", userId)
        .single()

      if (data && !error) {
        setAvatarUrl(data.avatar_url)

        // Gerar iniciais a partir do nome completo ou nome de usuário
        if (data.full_name) {
          const names = data.full_name.split(" ")
          if (names.length > 1) {
            setInitials(`${names[0][0]}${names[names.length - 1][0]}`.toUpperCase())
          } else {
            setInitials(names[0][0].toUpperCase())
          }
        } else if (data.username) {
          setInitials(data.username[0].toUpperCase())
        }
      }
    }

    loadProfile()
  }, [userId, supabase])

  return (
    <Avatar className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar do usuário" />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
