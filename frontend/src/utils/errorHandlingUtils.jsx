import Swal from "sweetalert2"

export async function handle_response_error(response) {
  try {
    const data = await response.json()
    console.error(data.error)
  } catch (error) {
      console.error("failed to parse JSON || process error:", error)
  }
}

export function handle_api_problem(error) {
  console.error("error while fetching data:", error)

  Swal.fire({
    title: "API error",
    text: "failed to fetch data! \n server is down or under maintenance.",
    icon: 'error',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 2500,
    position: 'center'
  })

  throw new Error("API error");
}
