import React from 'react'
import {
  Grid,
  makeStyles,
  withStyles,
  WithStyles,
  Avatar,
  CardHeader,
  IconButton,
  Container,
  Card,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import { styles } from 'src/styles/global'
import clsx from 'clsx'
import { DurationResponseType } from 'src/defaultState'
import moment from 'moment'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'
import { MyTheme } from 'src/styles/material-ui'

export interface IDurationDetails {
  hidden: boolean
  totalDuration: number
}

const convertToHours = (duration: number) => {
  const diffDuration = moment.duration(duration)

  const totalHours = Math.floor(diffDuration.asHours())
  const totalMinutes = Math.floor(diffDuration.asMinutes() % 60)

  return `${totalHours} hours ${totalMinutes} mins`
}

const DurationDetails: React.FC<
  IDurationDetails & WithStyles<typeof styles>
> = ({ classes, hidden, totalDuration }) => {
  const css = useStyles()
  const theme = useTheme<MyTheme>()
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'))

  if (hidden) return <React.Fragment></React.Fragment>

  return (
    <Container maxWidth="md">
      <Grid item container justifyContent="center" spacing={1}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar classes={{ root: css.cardAvatar }} aria-label="">
                  1x
                </Avatar>
              }
              title={convertToHours(totalDuration)}
              subheader="Videos at 1.0x speed"
              classes={{
                title: css.cardTitle,
                subheader: css.cardSubtitle,
                root: css.cardRoot,
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar classes={{ root: css.cardAvatar }} aria-label="">
                  1.25x
                </Avatar>
              }
              title={convertToHours(totalDuration / 1.25)}
              subheader="Videos at 1.25x speed"
              classes={{
                title: css.cardTitle,
                subheader: css.cardSubtitle,
                root: css.cardRoot,
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar classes={{ root: css.cardAvatar }} aria-label="">
                  1.5x
                </Avatar>
              }
              title={convertToHours(totalDuration / 1.5)}
              subheader="Videos at 1.50x speed"
              classes={{
                title: css.cardTitle,
                subheader: css.cardSubtitle,
                root: css.cardRoot,
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar classes={{ root: css.cardAvatar }} aria-label="">
                  1.75x
                </Avatar>
              }
              title={convertToHours(totalDuration / 1.75)}
              subheader="Videos at 1.75x speed"
              classes={{
                title: css.cardTitle,
                subheader: css.cardSubtitle,
                root: css.cardRoot,
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar classes={{ root: css.cardAvatar }} aria-label="">
                  2x
                </Avatar>
              }
              title={convertToHours(totalDuration / 2)}
              subheader="Videos at 2.0x speed"
              classes={{
                title: css.cardTitle,
                subheader: css.cardSubtitle,
                root: css.cardRoot,
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
const useStyles = makeStyles<MyTheme>((theme) => ({
  cardRoot: {
    [theme.breakpoints.down('sm')]: {
      padding: '5px',
    },
  },
  cardTitle: {
    fontFamily: 'Pacifico',
    fontSize: '1.125rem',
    color: 'teal',
    letterSpacing: '0.1px',
  },
  cardAvatar: {
    backgroundColor: theme.palette.secondary.light,
    fontSize: '0.9rem',
    [theme.breakpoints.down('sm')]: {
      height: '30px',
      width: '30px',
    },
  },
  cardSubtitle: {
    fontFamily: 'Langar',
  },
}))

export default withStyles(styles)(DurationDetails)
