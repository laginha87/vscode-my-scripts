# This is a sample script.
# Checkout available scripts by running Open my scripts from the palette.
# Any scripts saved in that folder can be picked up.

def copy(text)
    IO.popen('pbcopy', 'w') {|f| f << text}
end

class Array
    def to_c
        copy map(&:to_s).join("\n")
    end
end

class String
    def to_c
        copy self
    end
end
