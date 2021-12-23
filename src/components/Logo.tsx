// material
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export default function Logo({
  sx = {
    width: 64,
    height: 64
  }
}: BoxProps) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  // const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg viewBox="0 0 292 293" fill={PRIMARY_LIGHT}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.5724 119.384C29.4659 132.472 51.3386 131.819 64.4266 117.926L80.0244 132.619C58.8215 155.127 23.3868 156.185 0.878906 134.982L15.5724 119.384Z"
          fill={PRIMARY_DARK}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M111.557 292.083C111.557 192.75 192.081 112.226 291.414 112.226L291.414 0.708033C130.492 0.708019 0.0390766 131.161 0.0390625 292.083L111.557 292.083Z"
          fill={PRIMARY_LIGHT}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M206.152 292.083C206.152 244.993 244.325 206.819 291.415 206.819L291.415 153.953C215.128 153.953 153.285 215.795 153.285 292.083L206.152 292.083Z"
          fill={PRIMARY_LIGHT}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M67.3515 200.404C81.7388 214.791 105.065 214.791 119.453 200.404L135.605 216.556C112.297 239.864 74.5072 239.864 51.1992 216.556L67.3515 200.404Z"
          fill={PRIMARY_DARK}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M156.029 116.714C169.923 129.802 191.796 129.149 204.884 115.255L220.481 129.949C199.279 152.457 163.844 153.514 141.336 132.312L156.029 116.714Z"
          fill={PRIMARY_DARK}
        />
      </svg>
    </Box>
  );
}
