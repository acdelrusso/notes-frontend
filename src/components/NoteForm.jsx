import React from 'react'

function NoteForm({addNote, newNote, handleNoteChange, handleLogout}) {
    return (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
      <button type="button" onClick={handleLogout}>logout</button>
    </form>  
    )
}

export default NoteForm

