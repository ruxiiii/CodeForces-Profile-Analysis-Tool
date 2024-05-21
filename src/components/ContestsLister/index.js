import { ContestTable } from "./ContestTable";
import { Container } from "@mui/material";

export const ContestLister = ({ contestsList }) => {
  return (
    <>
      {contestsList?.length && (
        <>
          <Container
            maxWidth={false}
            sx={{
              marginTop: 5,
            }}
          >
            <ContestTable>{contestsList}</ContestTable>
          </Container>
        </>
      )}
    </>
  );
};
