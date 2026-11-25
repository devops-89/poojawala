import React from "react";
import signUpbackgroundImage from "@/images/signup-bg1.png";
import {
  Box,
  Card,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { COLORS } from "@/utils/enums";
import logo from "@/images/logo.webp";
import Image from "next/image";
import { AUTHENTICATION_WRAPPER_PROPS } from "@/utils/types";
import FONTS from "@/utils/fonts";
const AuthenticationWrapper = ({
  bg,
  heading,
  description,
  list,
  children,
}: AUTHENTICATION_WRAPPER_PROPS) => {
  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url(${bg})`,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container>
            <Grid size={10} sx={{ margin: "auto" }}>
              <Card
                sx={{
                  backgroundColor: COLORS.BG_CREAM,
                  p: 3,
                  borderRadius: "20px",
                }}
              >
                <Grid container spacing={4}>
                  <Grid size={5}>
                    <Image src={logo} alt="" width={100} />
                    <Typography
                      sx={{
                        fontSize: 35,
                        color: COLORS.BLACK,
                        fontWeight: 600,
                        fontFamily: FONTS.PRIMARY,
                        width: "80%",
                        lineHeight: "35px",
                        my: 2,
                      }}
                    >
                      {heading}
                    </Typography>
                    <Typography sx={{ fontSize: 16, mb: 2 }}>
                      {description}
                    </Typography>
                    <List>
                      {list?.map((val, i) => (
                        <ListItem key={i}>
                          <ListItemAvatar
                            sx={{
                              // border: "1px solid" + COLORS.PRIMARY,
                              fontFamily: FONTS.PRIMARY,
                              width: 30,
                              height: 30,
                              displa:"flex",
                              alignItems:"center",
                              justifyContent:"center",
                              minWidth:25
                            }}
                          >
                            <val.icon sx={{color:COLORS.PRIMARY}} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={val.label}
                            slotProps={{
                              primary: {
                                sx: {
                                  fontSize: 15,
                                  fontFamily: FONTS.PRIMARY,
                                  fontWeight:600
                                },
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid size={7}>{children}</Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthenticationWrapper;
