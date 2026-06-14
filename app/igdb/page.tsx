"use server"

export default async function TwitchRequest() {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_API_KEY}&grant_type=client_credentials`,
    { method: "POST" }
  )

  const data = await response.json()
  console.log("Risposta:", data)
}
