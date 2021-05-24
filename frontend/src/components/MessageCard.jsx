import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import parse from "html-react-parser";
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function MessageCard(props) {
  const classes = useStyles();

  return (
    <Chip
      size="medium"
      variant="outlined"
      //icon={<FaceIcon />}
      label={parse(props.content)}
      onDelete={props.handleDelete}
      color={props.level}
    />
  );
}

export default MessageCard;
