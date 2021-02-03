import React, { useEffect, useState } from 'react'
import {
  Grid,
  makeStyles,
  withStyles,
  WithStyles,
  Container,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Snackbar,
  colors,
  SnackbarContent,
} from '@material-ui/core'
import { styles } from 'src/styles/global'
import clsx from 'clsx'
import { useFormik } from 'formik'
import Button from '@material-ui/core/Button'
import { MyTheme } from 'src/styles/material-ui'
import * as yup from 'yup'
import moment from 'moment'
import { DurationResponseType, stateFalse, stateTrue } from 'src/defaultState'
import DurationDetails from 'src/components/DurationDetails'
import axios from 'axios'
import { Close as CloseIcon } from '@material-ui/icons'

const validationSchema = yup.object({
  playlistID: yup.string().required('Youtube Playlist ID is required'),
})

export interface Iindex {}

const index: React.FC<Iindex & WithStyles<typeof styles>> = ({ classes }) => {
  const css = useStyles()
  const theme = useTheme<MyTheme>()
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'))

  const [response, setResponse] = useState<DurationResponseType>(stateFalse)

  const [totalDuration, setTotalDuration] = useState<number>(0)
  const [hidden, setHidden] = useState<boolean>(true)

  const [snackbarOptions, setSnackbarOptions] = useState({
    open: false,
    message: '',
    backgroundColor: '#000',
  })

  useEffect(() => {
    if (response.videoDurations.length) {
      let totalMS = 0
      response.videoDurations.forEach((item) => {
        totalMS += moment.duration(item).asMilliseconds()
      })
      setTotalDuration(totalMS)
    }
  }, [response])

  const formik = useFormik({
    initialValues: { playlistID: '' },
    onSubmit: async (values, {}) => {
      await handleSubmit()
      formik.resetForm()
    },
    validationSchema,
  })

  const handleSubmit = async () => {
    setResponse(stateFalse)
    setHidden(true)

    const axiosData = (
      await axios.get<DurationResponseType>('/api/youtube_api', {
        params: {
          playlistID: formik.values.playlistID,
        },
      })
    ).data

    if (axiosData.error) {
      setSnackbarOptions({
        open: true,
        message: 'Error. Try Again!',
        backgroundColor: colors.red[300],
      })
    } else {
      setSnackbarOptions({
        open: true,
        message: 'Success.',
        backgroundColor: 'teal',
      })
      setResponse(axiosData)
      setHidden(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h1" color="secondary" paragraph>
        Get the Playtime of an Youtube Playlist.
      </Typography>
      <Container maxWidth="sm">
        <form onSubmit={(event) => formik.handleSubmit(event)}>
          <Grid container justifyContent="center" className={css.mainGrid}>
            <Grid item xs={9}>
              <TextField
                autoComplete="off"
                fullWidth
                name="playlistID"
                value={formik.values.playlistID}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label="playlist ID"
                error={
                  formik.touched.playlistID && Boolean(formik.errors.playlistID)
                }
                helperText={
                  formik.touched.playlistID && formik.errors.playlistID
                }
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                className={css.button}
                variant="contained"
                color="primary"
                type="submit"
                disabled={
                  Boolean(formik.errors.playlistID) || formik.isSubmitting
                }
              >
                {formik.isSubmitting ? (
                  <CircularProgress
                    style={{ height: '20px', width: '20px' }}
                    className={css.progressIcon}
                    variant="indeterminate"
                  />
                ) : (
                  'Get It!'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Grid
        item
        container
        style={{
          marginTop: matchesMD ? '1rem' : '2rem',
          minHeight: matchesMD ? '246px' : '248px',
        }}
      >
        <DurationDetails hidden={hidden} totalDuration={totalDuration} />
      </Grid>
      <Grid item container justifyContent="center" className={classes.marginY}>
        <Typography className={css.credit} variant="body1" color="primary">
          Made with React. <br />
          Fork and Star
          <br />
          <a
            href="http://github.com/irfan7junior/utube-playtime"
            target="_blank"
            rel="noopener noreferrer"
            className={css.repo}
          >
            Github
          </a>
        </Typography>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        autoHideDuration={2500}
        open={snackbarOptions.open}
        onClose={() => {
          setSnackbarOptions({ ...snackbarOptions, open: false })
        }}
      >
        <SnackbarContent
          message={snackbarOptions.message}
          style={{ backgroundColor: snackbarOptions.backgroundColor }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => {
                setSnackbarOptions({ ...snackbarOptions, open: false })
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </Container>
  )
}
const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: '2rem',
  },
  button: {
    fontFamily: 'Langar',
    fontSize: '1.25rem',
    height: '40px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
  },
  progressIcon: {
    color: 'white',
  },
  credit: {
    padding: '1rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  repo: {
    textDecoration: 'none',
    color: 'white',
    border: '2px solid #649bb8',
    background: '#b8b2b2',
    borderRadius: '10px',
    padding: '0 5px',
    transition: 'background-color 1s',
    '&:hover': {
      backgroundColor: 'teal',
    },
    '&:active': {
      backgroundColor: '#0c3e3e',
    },
  },
}))

export default withStyles(styles)(index)
