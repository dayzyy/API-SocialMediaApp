import Swal from "sweetalert2";

export function confirmation_screen(text, confirm, cancel) {
  Swal.fire({
    showConfirmButton: false,
    html:`
        <div style="display: flex; flex-direction: column; gap: 2rem">
          <p style="font-size: 1.8rem">${text}</p>
          <div style="display: flex; justify-content: center; gap: 2.5rem;">
            <button id="confirmButton" style="height: 45px; width: 65px; background-color: #76AF61; border: none; outline: none; border-radius: 5px; color: white; font-weight: bold">yes</button>
            <button id="cancelButton" style="height: 45px; width: 65px; background-color: #F26161; border: none; outline: none; border-radius: 5px; color: white; font-weight: bold">no</button>
          </div>
        </div>
      `,
    didRender: _ => {
      document.getElementById("confirmButton").addEventListener('click', _ => {
        confirm()
        Swal.close()
      })

      document.getElementById("cancelButton").addEventListener('click', _ => {
        cancel()
        Swal.close()
      })
    }
  }) 
}
