import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import IconCheck from "~/renderer/icons/Check";
import IconCross from "~/renderer/icons/Cross";

export type Status = "next" | "active" | "valid" | "error" | "disable";
const RADIUS = 18;

const Wrapper = styled(Box).attrs<{
  status: Status;
}>((p: { status: Status }) => ({
  alignItems: "center",
  color: ["active", "valid"].includes(p.status)
    ? "palette.primary.main"
    : p.status === "error"
      ? "alertRed"
      : "palette.text.shade40",
  grow: true,
  justifyContent: "center",
  relative: true,
}))<{
  status: Status;
}>`
  width: ${RADIUS}px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`;

const StepNumber = styled(Box).attrs<{
  status: Status;
}>(p => ({
  color: ["active", "valid", "error"].includes(p.status)
    ? "palette.primary.contrastText"
    : "palette.text.shade40",
  bg: ["active", "valid"].includes(p.status)
    ? "palette.primary.main"
    : p.status === "error"
      ? "alertRed"
      : "palette.background.paper",
  ff: p.status === "active" ? "Inter|Bold" : "Inter|SemiBold",
}))<{
  status: Status;
}>`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid
    ${p =>
      ["active", "valid"].includes(p.status)
        ? p.theme.colors.palette.primary.main
        : p.status === "error"
          ? p.theme.colors.alertRed
          : p.theme.colors.palette.text.shade30};
  font-size: 10px;
  height: ${RADIUS}px;
  line-height: ${RADIUS}px;
  box-sizing: content-box;
  transition: all ease-in-out 0.1s ${p => (["active", "valid"].includes(p.status) ? 0.4 : 0)}s;
  width: ${RADIUS}px;
`;

const Label = styled(Box).attrs<{
  status: Status;
}>(p => ({
  fontSize: 3,
  ff: p.status === "active" ? "Inter|SemiBold" : "Inter|Medium",
  px: 2,
}))<{
  status: Status;
}>`
  line-height: 1.2;
  position: absolute;
  top: 25px;
  transition: color ease-in-out 0.1s ${p => (["active", "valid"].includes(p.status) ? 0.4 : 0)}s;
`;

type Props = {
  number: number;
  status: Status;
  children: React.ReactNode;
};

const Step = ({ number, status, children }: Props) => {
  return (
    <Wrapper status={status}>
      <StepNumber status={status}>
        {status === "active" || status === "next" ? (
          number
        ) : status === "valid" ? (
          <IconCheck size={10} />
        ) : (
          <IconCross size={10} />
        )}
      </StepNumber>
      <Label status={status}>{children}</Label>
    </Wrapper>
  );
};
export default Step;
