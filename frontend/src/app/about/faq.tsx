import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <>
    <h2 className="font-bold text-2xl mb-4 underline">FAQ'S about me!</h2>
      <Accordion
        type="single"
        collapsible
        className="max-w-lg"
      >
        <AccordionItem value="anime">
          <AccordionTrigger>Ahum, do you watch animes?</AccordionTrigger>
          <AccordionContent>
            Yes, I do
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="manga">
          <AccordionTrigger>Ahum, do you read manga?</AccordionTrigger>
          <AccordionContent>
            Yes, I do
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-anime">
          <AccordionTrigger>
            Ahum, What's your favorite anime and manga?
          </AccordionTrigger>
          <AccordionContent>
            Sakamoto Days
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-movie-series">
          <AccordionTrigger>
            Ahum, What's your favorite movie series?
          </AccordionTrigger>
          <AccordionContent>
            Very complex question. I love John Wick and Harry Potter
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-code-editor">
          <AccordionTrigger>
            Ahum, What's your favorite code editor or IDE?
          </AccordionTrigger>
          <AccordionContent>
            Good question. It depends on me, which one I use but I use VS Code and Neovim a lot but I also like Jet Brains IDE, Zed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-programming-language">
          <AccordionTrigger>
            Ahum, What's your favorite programming language?
          </AccordionTrigger>
          <AccordionContent>
            Python
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-sakamoto-days-character">
          <AccordionTrigger>
            Ahum, Who is your favorite character in Sakamoto Days?
          </AccordionTrigger>
          <AccordionContent>
            Yoichi Nagumo
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-country">
          <AccordionTrigger>
            Ahum, What's your favorite country?
          </AccordionTrigger>
          <AccordionContent>
            Well, I love my country but I do love the vibes of Japan
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-novel-or-novel-series">
          <AccordionTrigger>
            Ahum, What's your favorite novel or novel Series?
          </AccordionTrigger>
          <AccordionContent>
            I love the Dracula Novel and I also love the Harry Potter novel series
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fav-song">
          <AccordionTrigger>
            Ahum, What's your favorite song or song genre?
          </AccordionTrigger>
          <AccordionContent>
            It's a pretty good question. I like anime songs or songs that gives me peace and relaxing vibes. I listen Dream Lantern and Your Name. OST a lot. Sometimes, I like little bit sad vibes or lofi music or instrumental of my favorite songs. I also like OST from Sakamoto Days anime OST. I love Songs by Aurora, ED Sheeran, RADWIMPS, Fuji Kaze, etc.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
