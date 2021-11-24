export const pageAnim = {
  hidden: { y: 400, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 2, ease: "anticipate", bounce: 0.25 },
  },
  exit: {
    opacity: 0,
    y: 400,
    transition: {
      duration: 2,
    },
  },
};

// export const colScrollAnim = {
//     hidden: {},
//     show: {},
// }

export const colScrollAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 2 } },
};
