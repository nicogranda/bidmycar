export const EDITOR_COMMANDS = ({
  exec,
  insertHeading,
  addLink,
  triggerImageUpload,
}) => [
  { type: "bold", title: "Negrita", action: () => exec("bold") },
  { type: "italic", title: "Cursiva", action: () => exec("italic") },
  { type: "underline", title: "Subrayado", action: () => exec("underline") },

  { type: "h2", title: "H2", action: () => insertHeading(2) },
  { type: "h3", title: "H3", action: () => insertHeading(3) },
  { type: "h4", title: "H4", action: () => insertHeading(4) },
  { type: "h5", title: "H5", action: () => insertHeading(5) },
  { type: "h6", title: "H6", action: () => insertHeading(6) },

  { type: "unorderedList", title: "Lista", action: () => exec("insertUnorderedList") },
  { type: "orderedList", title: "Lista numerada", action: () => exec("insertOrderedList") },

  { type: "link", title: "Enlace", action: addLink },
  { type: "image", title: "Imagen", action: triggerImageUpload },
];
